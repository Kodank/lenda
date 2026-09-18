#!/usr/bin/env python3
"""Assert no two DIFFERENT trophy ids share identical file hashes."""
import hashlib, os, re, sys
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
text=open(os.path.join(ROOT,'js/data.js'),encoding='utf-8').read()
# parse TROPHIES img paths
pairs=re.findall(r'(\w+)\s*:\s*\{[^}]*?img:\s*"([^"]+)"', text)
# only within TROPHIES block roughly — filter img/trophies
pairs=[(i,p) for i,p in pairs if 'trophies/' in p]
hashes={}
dups=[]
missing=[]
for tid, rel in pairs:
  path=os.path.join(ROOT, rel)
  if not os.path.isfile(path):
    missing.append((tid, rel)); continue
  h=hashlib.md5(open(path,'rb').read()).hexdigest()
  if h in hashes and hashes[h]!=tid:
    dups.append((tid, hashes[h], h, rel))
  else:
    hashes[h]=tid
print('trophies checked:', len(pairs))
if missing:
  print('MISSING', missing); sys.exit(1)
if dups:
  print('DUPLICATE HASHES across different ids:', dups); sys.exit(1)
print('OK: all trophy files unique by hash')
