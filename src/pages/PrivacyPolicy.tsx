import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Link 
          to="/learn" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>

        <h1 className="text-3xl font-display font-bold text-foreground mb-6">
          Privacy Policy
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3">Introduction</h2>
            <p className="leading-relaxed">
              Rocket Science ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our mobile application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="leading-relaxed mb-3">
              Our app is designed with privacy in mind. We collect minimal data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Local Storage Data:</strong> App preferences and progress are stored 
                locally on your device and are not transmitted to our servers.
              </li>
              <li>
                <strong>Usage Analytics:</strong> We may collect anonymous usage statistics 
                to improve the app experience. This data cannot identify you personally.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="leading-relaxed">
              Any information collected is used solely to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Provide and maintain the app functionality</li>
              <li>Save your learning progress locally</li>
              <li>Improve the app based on anonymous usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Storage and Security</h2>
            <p className="leading-relaxed">
              Your learning progress and preferences are stored locally on your device. 
              We do not store personal data on external servers. We implement appropriate 
              security measures to protect any data processed by the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="leading-relaxed">
              Our app may use third-party services that have their own privacy policies. 
              These may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Google Play Services (for app distribution)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
            <p className="leading-relaxed">
              Our app is educational and suitable for users of all ages. We do not knowingly 
              collect personal information from children. The app functions without requiring 
              any personal data input.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-primary">
              support@rocketscience.app
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Rocket Science. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
