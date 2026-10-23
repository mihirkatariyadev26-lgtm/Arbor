import React from "react";
import "./help.css";
import Navbar from "../Navbar.jsx";

const steps = [
  {
    id: "before",
    number: "00",
    title: "Before you begin",
    eyebrow: "Get ready",
    image: "/Before.webp",
    alt: "Arbor repository before the first push",
    description:
      "Have a local project folder ready, an Arbor account, and a remote repository created in the Arbor web app. You will link that remote repository to this folder in a later step.",
    note: "Keep the remote repository page open so you can copy its URL.",
  },
  {
    id: "install",
    number: "01",
    title: "Install Arbor",
    eyebrow: "One-time setup",
    image: "/Install.webp",
    alt: "Installing the Arbor command-line tool",
    description:
      "Install the command-line tool globally with npm. Arbor requires Node.js 18 or newer. Then open a terminal in your project folder and initialize it.",
    commands: ["npm install -g arbor-cli", "cd path/to/your-project", "arbor init"],
    note: "arbor init creates the local .Arbor repository metadata.",
  },
  {
    id: "login",
    number: "02",
    title: "Log in",
    eyebrow: "Connect your account",
    image: "/Login.webp",
    alt: "Logging in to an Arbor account",
    description:
      "Sign in from your terminal using the Arbor account you use on the web app. Follow the prompts to enter your account details.",
    commands: ["arbor login"],
    note: "If your session expires, run arbor login again.",
  },
  {
    id: "link",
    number: "03",
    title: "Link your repository",
    eyebrow: "Choose a remote",
    image: "/Link.webp",
    alt: "Linking a local Arbor repository to a remote repository",
    description:
      "Copy the repository URL from the Arbor web app and connect it to your initialized local folder.",
    commands: ["arbor link <repository-url>"],
    note: "Use the repository URL from Arbor, not the URL of a local folder.",
  },
  {
    id: "add",
    number: "04",
    title: "Stage your changes",
    eyebrow: "Select what to save",
    image: "/Add.webp",
    alt: "Adding project files to the Arbor staging area",
    description:
      "Choose the files to include in your next commit. Add a single file when you want a focused change, or use a dot to stage all changes in the project.",
    commands: ["arbor add src/App.jsx", "arbor add ."],
    note: "Use either command, depending on whether you want one file or all changes.",
  },
  {
    id: "commit",
    number: "05",
    title: "Commit a snapshot",
    eyebrow: "Describe the change",
    image: "/Commit.webp",
    alt: "Creating a commit in Arbor",
    description:
      "Save the staged changes as a commit. Write a short message that explains what changed; put messages with spaces in quotes.",
    commands: ['arbor commit "Add project documentation"'],
    note: "Only staged files are included in the commit.",
  },
  {
    id: "push",
    number: "06",
    title: "Push to Arbor",
    eyebrow: "Send it remote",
    image: "/Push.webp",
    alt: "Pushing a commit to the remote Arbor repository",
    description:
      "Upload your local commits to the linked remote repository so they are available in the Arbor web app.",
    commands: ["arbor push"],
    note: "Arbor uses its hosted API by default; you do not need AWS credentials.",
  },
  {
    id: "after",
    number: "07",
    title: "You’re all set",
    eyebrow: "What’s next",
    image: "/After.webp",
    alt: "Arbor repository after changes have been pushed",
    description:
      "Open the repository in the Arbor web app to review your pushed changes. For your next update, stage, commit, and push again.",
    commands: ["arbor add .", 'arbor commit "Describe your update"', "arbor push"],
    note: "To bring remote changes into your local project, use arbor pull.",
  },
];

function Help() {
  return (
    <div className="docs-page">
      <Navbar />
      <main className="docs-content">
        <div className="docs-container">
          <header className="docs-hero">
            <p className="docs-kicker">ARBOR / QUICKSTART</p>
            <h1 className="docs-header">From your first file to your first push.</h1>
            <p className="docs-intro">
              A practical, step-by-step guide to setting up Arbor and sending
              your project to a remote repository.
            </p>
            <div className="docs-meta" aria-label="Guide requirements">
              <span>8 clear steps</span>
              <span>Node.js 18+</span>
              <span>Terminal friendly</span>
            </div>
          </header>

          <nav className="docs-toc" aria-label="Quick start steps">
            {steps.map((step) => (
              <a key={step.id} href={`#${step.id}`}>
                <span>{step.number}</span>
                {step.title}
              </a>
            ))}
          </nav>

          <section className="docs-steps" aria-label="Arbor quick start guide">
            {steps.map((step) => (
              <article className="docs-step" id={step.id} key={step.id}>
                <div className="step-copy">
                  <p className="step-eyebrow">
                    <span>{step.number}</span>
                    {step.eyebrow}
                  </p>
                  <h2>{step.title}</h2>
                  <p className="step-desc">{step.description}</p>
                  {step.commands && (
                    <div className="step-commands" aria-label="Commands">
                      {step.commands.map((command) => (
                        <code key={command}>{command}</code>
                      ))}
                    </div>
                  )}
                  <p className="step-note">{step.note}</p>
                </div>
                <figure className="step-visual">
                  <img src={step.image} alt={step.alt} loading="lazy" />
                  <figcaption>
                    <span>ARBOR QUICKSTART</span>
                    {step.title}
                  </figcaption>
                </figure>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Help;
