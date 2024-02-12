import urllib.request, json

URL = "http://150.165.15.10:81/mediaProvasPraticas"
with urllib.request.urlopen(URL) as url:
    data = json.loads(url.read().decode())
    
    for k,v in data.items():
        print(k + " " + str(v).replace('.', ','))
