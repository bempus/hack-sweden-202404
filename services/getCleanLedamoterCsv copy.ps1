 Import-Csv 'datasets/ledamoter-2024-04-27.csv' | Where-Object {
    if(!$_.Tom){ return $true }
    (get-date $_.Tom) -gt [datetime]::now
} | Sort-Object ID -Unique | Where-Object ID -NotLike $null | ForEach-Object {
    [PSCustomObject]@{
        ID = $_.ID
        Name = "$($_.Förnamn) $($_.Efternamn)"
        Party = $_.Parti
        Title = $_.Titel
        Gender = $_.Kön
        Born = $_.Född
        Role = $_.Uppdragsroll
        Division = $_.Valkrets
        Status = $_.Status
        IsChairman = ($_.Status -eq 'Talman')
        IsViceChairman = ($_.Status -like '*Vice Talman*')
        
    }
} | Export-Csv -Delimiter "," -Encoding utf8 -Path "datasets/ledamoter-2024-04-27_filtered.csv"