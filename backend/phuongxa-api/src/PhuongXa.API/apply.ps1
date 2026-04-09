$c = Get-Content "c:\Users\buidi\AppData\Roaming\Code\User\workspaceStorage\7b7f6cc25866ac68908cca5cb0ea93db\GitHub.copilot-chat\chat-session-resources\6d95417f-0324-41a5-b5ed-c6b415e224c2\call_MHxBeWRYN0sxUmFXT2w3REtBM0s__vscode-1775497064463\content.txt" -Encoding UTF8 -Raw
$i = $c.IndexOf("```csharp") + 9
$e = $c.IndexOf("```", $i)
$o = $c.Substring($i, $e - $i).Trim()
Set-Content "D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Admin\AdminArticlesController.cs" -Value $o -Encoding UTF8