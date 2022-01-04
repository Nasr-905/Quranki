#Takes my corrected data for the end and beginnnings of segments and uses the times on alfasy to cut audio
import os
import json
from pydub import AudioSegment

with open("Alafasy_128kbps.json") as f:
    #Reference data for where words start and end in audio
    alfasy = json.load(f)

with open("segments(cor).json") as e:
    #My data for where segments are divided in the quran text
    seg = json.load(e)

for x in alfasy:
    aya = x["ayah"] - 1
    sura = x["surah"] - 1
    fSura = str(sura+1).zfill(3)
    fAya = str(aya+1).zfill(3)
    rec = AudioSegment.from_mp3("000_versebyverse/" + fSura + fAya + ".mp3")
    for y in seg[sura][aya]:
        segment = str(seg[sura][aya].index(y)+1).zfill(2)
        start = x["segments"][y[0]][2]
        end = x["segments"][y[1]-1][3]
        audio = rec[start:end]
        audio.export("segmented/" + fSura + fAya + segment + ".mp3", format="mp3")