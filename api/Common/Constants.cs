namespace DoAnTotNghiep.API.Common;

public static class MaxLength
{
    public const int Default = 100;
    public const int Short = 50;
    public const int Description = 1000;
    public const int Title = 200;
    public const int Summary = 500;
    public const int Note = 500;  // Ghi chú ngắn
    public const int FullContent = 4000; // Nội dung dài (article, blog)
    public const int Credential = 255;  // Hash password (bcrypt, etc.)
    public const int Role = 50;
    public const int Phone = 15;
    public const int Minimum = 10;
    public const int Medium = 20;
    public const int ShortDesc = 100;
    public const int MaxDesc = 1000;
}