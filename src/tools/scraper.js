import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURACIÓN DE URLS
// ==========================================
const SEREBII_URL = "https://www.serebii.net/pokedex-champions/golisopod/";
const WIKIDEX_STONE_URL = "http://wikidex.net/wiki/Golisopodita";
const WIKIDEX_POKEMON_URL = "https://www.wikidex.net/wiki/Golisopod";

const POKEMON_ID = "golisopod"; 
const POKEMON_NAME_CAPITALIZED = "Golisopod";
const POKEMON_TYPES = ['Bug', 'Water'];
const POKEMON_MEGA_TYPES = ['Bug', 'Steel']; 
const POKEMON_WEIGHT = 108.0;
const POKEMON_MEGA_WEIGHT = 148.0;

const DATE = new Date().toISOString().split('T')[0];
const AUTO_SCRAPED_TAG = `// [AUTO-SCRAPED: ${DATE}]`;

async function scrapeSerebii(url) {
  console.log(`[+] Escrapeando Serebii: ${url}`);
  const response = await fetch(url);
  const data = await response.text();
  const $ = cheerio.load(data);
  
  let stats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  let megaStats = null;
  
  // 1. Stats
  $('td.fooinfo').each((i, el) => {
    const text = $(el).text();
    if (text.includes("Base Stats - Total:")) {
      const tdList = $(el).nextAll('td.fooinfo');
      const currentStats = {
        hp: parseInt($(tdList[0]).text(), 10),
        atk: parseInt($(tdList[1]).text(), 10),
        def: parseInt($(tdList[2]).text(), 10),
        spa: parseInt($(tdList[3]).text(), 10),
        spd: parseInt($(tdList[4]).text(), 10),
        spe: parseInt($(tdList[5]).text(), 10)
      };

      if (stats.hp === 0) stats = currentStats;
      else megaStats = currentStats;
    }
  });

  // 2. Abilities
  const abilities = [];
  const megaAbilities = [];
  $('td.fooleft').each((i, el) => {
    if ($(el).text().includes("Abilities:")) {
      const abs = $(el).find('a').map((_, a) => $(a).text().trim()).get();
      if (abilities.length === 0) abilities.push(...abs);
      else megaAbilities.push(...abs);
    }
  });

  // 3. Moves
  const movesSet = new Set();
  $("a[href^='/attackdex-champions/']").each((i, el) => {
    let moveName = $(el).text().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (moveName) movesSet.add(moveName);
  });
  const moves = Array.from(movesSet);

  return { stats, megaStats, abilities, megaAbilities, moves };
}

async function scrapeWikidex(stoneUrl, pokemonUrl) {
  let megaStoneImg = '';
  let megaModelUrl = '';
  let model3dUrl = '';

  if (stoneUrl) {
    console.log(`[+] Escrapeando Wikidex Megapiedra: ${stoneUrl}`);
    const resStone = await fetch(stoneUrl);
    const $stone = cheerio.load(await resStone.text());
    
    $stone('img').each((i, el) => {
      const src = $stone(el).attr('src');
      if (src && src.includes('ita') && !megaStoneImg) megaStoneImg = src; // He cambiado a 'ita' para que sea generico
    });
  }

  if (pokemonUrl) {
    console.log(`[+] Escrapeando Wikidex Pokémon 3D: ${pokemonUrl}`);
    const resPoke = await fetch(pokemonUrl);
    const $poke = cheerio.load(await resPoke.text());
    model3dUrl = $poke('.cmod3D img').first().attr('src');

    $poke('.cmod3D img').each((i, el) => {
      const src = $poke(el).attr('src');
      if (src && src.includes('Mega-')) {
         let cleanSrc = src;
         if (cleanSrc.includes('thumb/')) {
           cleanSrc = cleanSrc.replace(/\/thumb\//, '/');
           cleanSrc = cleanSrc.substring(0, cleanSrc.lastIndexOf('/'));
         }
         if (!cleanSrc.endsWith('.gif')) {
           megaModelUrl = cleanSrc;
         }
         return false; // break the loop after first match
      }
    });
  }

  return { megaStoneImg, megaModelUrl, model3dUrl };
}

async function main() {
  try {
    const serebiiData = await scrapeSerebii(SEREBII_URL);
    const wikidexData = await scrapeWikidex(WIKIDEX_STONE_URL, WIKIDEX_POKEMON_URL);
    
    console.log("=== DATOS EXTRAÍDOS ===");
    console.log("Habilidades:", serebiiData.abilities);
    console.log("Ataques (total):", serebiiData.moves.length);
    console.log("Modelo 3D (Normal):", wikidexData.model3dUrl);
    if(serebiiData.megaStats) console.log("Habilidades Mega:", serebiiData.megaAbilities);
    console.log("Modelo 3D (Mega):", wikidexData.megaModelUrl);

    // 1. Inyectar en champions-custom.ts
    const codeToInjectCustom = `
  ${AUTO_SCRAPED_TAG}
  '${POKEMON_ID}': {
    name: "${POKEMON_NAME_CAPITALIZED}",
    types: ${JSON.stringify(POKEMON_TYPES)},
    baseStats: ${JSON.stringify(serebiiData.stats)},
    abilities: ${JSON.stringify(serebiiData.abilities)},
    weightkg: ${POKEMON_WEIGHT},
    extraMoves: ${JSON.stringify(serebiiData.moves)}
  },${serebiiData.megaStats ? `
  ${AUTO_SCRAPED_TAG}
  '${POKEMON_ID}mega': {
    name: "${POKEMON_NAME_CAPITALIZED}-Mega",
    types: ${JSON.stringify(POKEMON_MEGA_TYPES)},
    baseStats: ${JSON.stringify(serebiiData.megaStats)},
    abilities: ${JSON.stringify(serebiiData.megaAbilities)},
    weightkg: ${POKEMON_MEGA_WEIGHT},
    sprite: '${wikidexData.megaModelUrl || ''}'
  },` : ''}`;

    const championsCustomPath = path.join(__dirname, '../data/champions-custom.ts');
    let customFile = fs.readFileSync(championsCustomPath, 'utf-8');
    if (!customFile.includes(`'${POKEMON_ID}':`)) {
      customFile = customFile.replace(/},?(\s*)};\s*$/, '},$1' + codeToInjectCustom + '\n};\n');
      fs.writeFileSync(championsCustomPath, customFile);
    }

    // 2. Inyectar objeto (Megapiedra) en items.ts
    if (serebiiData.megaStats) {
      const itemsPath = path.join(__dirname, '../data/items.ts');
      let itemsFile = fs.readFileSync(itemsPath, 'utf-8');
      if (!itemsFile.includes(`'${POKEMON_ID}ite':`)) {
        const itemInject = `\n  ${AUTO_SCRAPED_TAG}\n  '${POKEMON_ID}ite': { id: '${POKEMON_ID}ite', name: '${POKEMON_NAME_CAPITALIZED}ite', sprite: '${wikidexData.megaStoneImg || ''}' }`;
        itemsFile = itemsFile.replace(/},?(\s*)};\s*$/, '},$1' + itemInject + '\n};\n');
        fs.writeFileSync(itemsPath, itemsFile);
      }
    }

    // 3. Inyectar en lista-champions.ts
    const listPath = path.join(__dirname, '../data/lista-champions.ts');
    let listFile = fs.readFileSync(listPath, 'utf-8');
    if (!listFile.includes(`'${POKEMON_ID}'`)) {
      const listInject = `\n  ${AUTO_SCRAPED_TAG}\n  '${POKEMON_ID}'${serebiiData.megaStats ? `, '${POKEMON_ID}mega'` : ''}`;
      listFile = listFile.replace(/\];\s*$/, ',' + listInject + '\n];\n');
      fs.writeFileSync(listPath, listFile);
    }
    
    console.log(`[!] ¡Inyección completada en todos los archivos con la etiqueta ${AUTO_SCRAPED_TAG}!`);

  } catch (error) {
    console.error("Error escrapeando:", error.message);
  }
}

main();
