#This was used to "corrected" my data (segments.json) to following the same number of words as alfasy
import os
import json
from pydub import AudioSegment

with open("Alafasy_128kbps.json") as f:
    #Reference data for where words start and end in audio
    alfasy = json.load(f)

with open("segments(cor).json") as e:
    #My data for where segments are divided in the quran text
    seg = json.load(e)

#Counts the number of times the number of words in the reference data doesn't match my word count
count = 0
#An array for ayas that don't match
cor = []
for x in alfasy:
    aya = x["ayah"] - 1
    sura = x["surah"] - 1
    #Number of words in ref aya
    wordsAl = len(x["segments"])
    #0-indexed number of segments in an aya
    index = len(seg[sura][aya]) - 1
    #Gets the last segment of an aya in my data and takes the word number it ends on
    #Essentially giving you the number of words in that aya
    wordsSeg = seg[sura][aya][index][1]
    #If the number of words in the reference data doesn't match the number of words in my data
    if wordsAl == wordsSeg:
        for y in seg[sura][aya]:
            start = x["segments"][y[0]][2]
            end = x["segments"][y[1]-1][3]
            y.append(start)
            y.append(end)
    else:
        times = []
        for z in x["segments"]:
            times.append([z[2],z[3]])
        cor.append([sura, aya, index+1, wordsSeg, times])
print(cor)
# for a in cor:
#     path = "corrected/"+str(a[0])+"/"+str(a[1])
#     os.makedirs(path)
#     sura = str(a[0]+1).zfill(3)
#     aya = str(a[1]+1).zfill(3)
#     print("sura" + sura + "aya" + aya)
#     rec = AudioSegment.from_mp3("000_versebyverse/" + sura + aya + ".mp3")
#     for b in a[4]:    
#         audio = rec[b[0]:b[1]]
#         audio.export(path + "/" + str(a[4].index(b)+1) + ".mp3", format="mp3")