import bismuthLogo from "@/assets/bismuth-logo.png";

export const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img src={bismuthLogo} alt="Bizmut logo" className="h-8 w-auto" />
        <span className="text-foreground font-semibold tracking-wider uppercase">Bizmut</span>
      </div>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Bizmut. Tous droits réservés.
      </p>
    </div>
  </footer>
);
