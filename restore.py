import json

log_path = r"C:\Users\pc\.gemini\antigravity\brain\280ec69e-368b-4f18-a73c-336796f188f3\.system_generated\logs\transcript_full.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for call in data['tool_calls']:
                args = call.get('arguments', {})
                if 'CommandLine' in args:
                    cmd = args['CommandLine']
                    if 'import { useState, useMemo, useRef, useEffect, memo, useCallback }' in cmd:
                        start = cmd.find("@'") + 3
                        if start < 3: start = cmd.find('@"') + 3
                        end = cmd.rfind("'@")
                        if end < 0: end = cmd.rfind('"@')
                        speed_code = cmd[start:end]
                        with open('src/SpeedMode.tsx', 'w', encoding='utf-8') as out:
                            out.write(speed_code)
                        print("FOUND AND RESTORED")
    except:
        pass
