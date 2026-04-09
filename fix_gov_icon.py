#!/usr/bin/env python3
import os
import re

files = [
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dang-ky\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\thanh-toan\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\ho-so\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\lich-hen\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\doi-mat-khau\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\tai-lieu\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dich-vu-cong\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\quan-ly-tai-lieu\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\quan-ly-ho-so\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\ca-nhan\\thong-bao\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dich-vu-cong\\[id]\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dang-nhap\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\dat-lai-mat-khau\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\doi-mat-khau-thanh-cong\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tra-cuu\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\quen-mat-khau\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tim-kiem\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\to-chuc\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tin-tuc\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\mot-cua\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\tin-tuc\\[slug]\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\nop-ho-so\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\album\\[id]\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\gop-y\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\lien-he\\hoi-dap\\page.tsx',
    'd:\\febecuoiki\\frontend\\nguoi-dan\\src\\app\\thu-vien\\video\\[id]\\page.tsx',
]

modified_files = []

for file_path in files:
    try:
        if not os.path.exists(file_path):
            print(f"SKIP: {file_path} - file not found")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace className="material-symbols-outlined with className="material-symbols-outlined gov-icon
        # But only if gov-icon doesn't already follow immediately
        # Pattern 1: double quotes
        def replace_double_quotes(match):
            full = match.group(0)
            if 'gov-icon' in full:
                return full
            return full.replace('className="material-symbols-outlined', 'className="material-symbols-outlined gov-icon')
        
        content = re.sub(r'className="material-symbols-outlined[^"]*"', replace_double_quotes, content)
        
        # Pattern 2: single quotes
        def replace_single_quotes(match):
            full = match.group(0)
            if 'gov-icon' in full:
                return full
            return full.replace("className='material-symbols-outlined", "className='material-symbols-outlined gov-icon")
        
        content = re.sub(r"className='material-symbols-outlined[^']*'", replace_single_quotes, content)
        
        # Only write if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            modified_files.append(file_path)
            print(f"MODIFIED: {file_path}")
        else:
            print(f"NO CHANGE: {file_path}")
            
    except Exception as e:
        print(f"ERROR: {file_path} - {str(e)}")

print(f"\nTotal modified files: {len(modified_files)}")
print("Modified files:")
for f in modified_files:
    print(f"  {f}")
