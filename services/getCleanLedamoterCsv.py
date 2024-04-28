import csv
with open('datasets/ledamoter-2024-04-27.csv', "r") as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:

        print(row['Förnamn'] + " " + row["Efternamn"])
