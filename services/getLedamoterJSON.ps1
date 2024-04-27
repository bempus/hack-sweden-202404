$euParlamentariker = Invoke-RestMethod -Method Get -Uri 'https://data.europarl.europa.eu/api/v2/meps?parliamentary-term=9&country-of-representation=SE&format=application%2Fld%2Bjson&offset=0&limit=500' -Headers @{accept = "*/*" } | 
convertfrom-json -AsHashtable |
Select-Object -ExpandProperty "data"

(Invoke-RestMethod -Method Get -Uri 'https://data.riksdagen.se/personlista/?&utformat=json&sort=sorteringsnamn&sortorder=asc').personlista.person | % {
    
    $Roles = ($_.personuppdrag.uppdrag | Where-Object { if ($_.Tom -like $null) {
                return $true
            } 
        (Get-Date $_.Tom) -gt [datetime]::now 
        }).roll_kod
        $fullName = "$($_.tilltalsnamn) $($_.efternamn)"
       $IsParlamentMember = ($euParlamentariker | Where-Object label -eq $fullName).count

    [PSCustomObject]@{
        Name          = $fullName
        Gender        = $_.kon
        Party         = $_.Parti
        Roles         = $Roles
        IsParlamentMember = $IsParlamentMember -gt 0
        IsOrdförande = $Roles.Contains("Ordförande")
        IsGovernmentMember = $Roles.Contains("Riksdagsledamot")
        ISViceOrförande = $Roles -like "*Vice Ordförande*" -and -not $Roles.Contains("Ordförande")
    }
} | Export-Csv -Path "datasets/ledamoter-$(Get-Date -Format 'yyyy-MM-dd')_filtered.csv"