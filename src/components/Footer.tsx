import bismuthLogo from "@/assets/bismuth-logo.png";

export const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img src={bismuthLogo} alt="Bismuth logo" className="h-8 w-auto" />
        <span className="text-foreground font-semibold tracking-wider uppercase">Bismuth</span>
      </div>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Bismuth. Tous droits réservés.
      </p>
    </div>
  </footer>
);
