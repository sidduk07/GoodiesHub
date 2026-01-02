export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container max-w-screen-xl py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-bold mb-4">
              <span>⚡</span> SwagList
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The #1 directory for student developer opportunities, hackathon swag, and tech perks.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Hackathons</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Internships</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Open Source</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Conferences</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Submit a Program</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Join Discord</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Newsletter</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SwagList. All rights reserved. Made with ❤️ for students.
        </div>
      </div>
    </footer>
  );
}
