using AngleSharp.Dom;
using Ganss.Xss;
using PhuongXa.Application.CacGiaoDien;

namespace PhuongXa.Infrastructure.CacDichVu;

public class DichVuLamSachHtml : IDichVuLamSachHtml
{
    private readonly HtmlSanitizer _boLamSachPhongPhu;
    private readonly HtmlSanitizer _boLamSachVanBan;

    public DichVuLamSachHtml()
    {
        // Rich content sanitizer — for article Content (allows safe formatting)
        _boLamSachPhongPhu = new HtmlSanitizer();
        _boLamSachPhongPhu.AllowedTags.UnionWith(new[]
        {
            "p", "br", "strong", "em", "u", "s", "b", "i",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote", "pre", "code",
            "table", "thead", "tbody", "tr", "th", "td",
            "a", "img", "figure", "figcaption",
            "div", "span", "hr", "sub", "sup"
        });
        _boLamSachPhongPhu.AllowedAttributes.UnionWith(new[]
        {
            "href", "src", "alt", "title", "class", "style",
            "width", "height", "target", "rel", "colspan", "rowspan"
        });
        _boLamSachPhongPhu.AllowedCssProperties.UnionWith(new[]
        {
            "color", "background-color", "text-align", "font-size",
            "font-weight", "font-style", "margin", "padding"
        });
        // Force rel="noopener noreferrer" on links with target
        _boLamSachPhongPhu.AllowedSchemes.UnionWith(new[] { "http", "https", "mailto" });
        _boLamSachPhongPhu.PostProcessNode += (_, args) =>
        {
            if (args.Node is IElement el
                && el.LocalName == "a"
                && el.HasAttribute("target"))
            {
                el.SetAttribute("rel", "noopener noreferrer");
            }
        };

        // Plain text sanitizer — strips ALL HTML
        _boLamSachVanBan = new HtmlSanitizer();
        _boLamSachVanBan.AllowedTags.Clear();
        _boLamSachVanBan.AllowedAttributes.Clear();
        _boLamSachVanBan.AllowedCssProperties.Clear();
    }

    public string LamSachHtml(string html)
    {
        if (string.IsNullOrWhiteSpace(html))
            return string.Empty;
        return _boLamSachPhongPhu.Sanitize(html);
    }

    public string LamSachVanBan(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;
        return _boLamSachVanBan.Sanitize(text);
    }
}
