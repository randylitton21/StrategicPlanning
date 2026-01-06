$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = (Resolve-Path "Strategic Planning .docx").Path
$doc = $word.Documents.Open($docPath)
$content = $doc.Content.Text
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output $content



