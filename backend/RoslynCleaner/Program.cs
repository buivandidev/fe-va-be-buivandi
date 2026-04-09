using System;
using System.IO;
using System.Text.RegularExpressions;

class P
{
	static void Main()
	{
		string p = File.ReadAllText(@"D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Public\PublicArticlesController.cs");
		var m = Regex.Match(p, @"(\[HttpGet\].*?public async Task<IActionResult> LayDanhSach\(.*?\}\s*)\s*\[HttpGet\(""admin""\)\]", RegexOptions.Singleline);
		if (m.Success)
		{
			string f = m.Groups[1].Value.Replace("[AllowAnonymous]", "");
			string a = File.ReadAllText(@"D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Admin\AdminArticlesController.cs");
			a = Regex.Replace(a, @"\[HttpGet\]\s*public async Task<IActionResult> LayDanhSach\(.*?\}\s*\[HttpGet\(""admin""\)\]", @"[HttpGet(""admin"")]", RegexOptions.Singleline);
			File.WriteAllText(@"D:\febecuoiki\backend\phuongxa-api\src\PhuongXa.API\Controllers\Admin\AdminArticlesController.cs", a.Replace(@"[HttpGet(""admin"")]", f + @"\n    [HttpGet(""admin"")]"));
			Console.WriteLine("Fixed");
		}
	}
}
