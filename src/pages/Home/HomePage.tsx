import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-4xl font-bold">Welcome to InfoOrbs – The DIY Smart Desktop Gadget</h1>
            <div className="text-lg">
                InfoOrbs is an open-source project that brings customizable, interactive widgets to your desk.
                Powered by an ESP32 and featuring five round screens, InfoOrbs can display clocks, stock tickers,
                weather, system stats, and much more! It's designed for makers, tinkerers, and anyone who loves
                to personalize their workspace.
            </div>
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-semibold">🔄 Get Started Fast</h2>
                    <p>
                        Easily flash your InfoOrbs device using our{' '}
                        <Link to="/flash" className="text-blue-600 hover:underline link">
                            Web Flasher
                        </Link>{' '}
                        – no special tools or software required.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">🕒 Customize Your Look</h2>
                    <p>
                        Browse and install custom clock designs directly from our{' '}
                        <Link to="/clocks" className="text-blue-600 hover:underline link">
                            Clock Repository
                        </Link>, or create and share your own.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">💡 Join the Community</h2>
                    <p>
                        InfoOrbs is fully open-source! Check out the{' '}
                        <a
                            href="https://github.com/brettdottech/info-orbs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline link"
                        >
                            GitHub repository
                        </a>{' '}
                        to contribute, report issues, or dive into the code.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold">💬 Connect with Us</h2>
                    <p>
                        Join the discussion, share your builds, and get support on our{' '}
                        <a
                            href="https://link.brett.tech/discord"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline link"
                        >
                            Discord server
                        </a>.
                    </p>
                </div>
            </div>

            <img src="/time.webp" className="rounded-lg" alt="InfoOrbs Front" width="1165" height="549"/>

            <div className="mt-8 text-sm text-gray-500">
                Make your workspace smarter and more fun with InfoOrbs!
            </div>
        </div>)
};

export default HomePage;