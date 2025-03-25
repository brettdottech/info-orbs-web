import {useEffect} from "react";
import EspWebInstallButton from "../../components/EspWebInstallButton.tsx";
import {Link} from "react-router-dom";

const WebFlashPage = () => {
    useEffect(() => {
        // noop
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1>InfoOrbs Flasher</h1>
            <div className="mb-6">
                <p>This webpage allows you to flash your InfoOrbs with the latest firmware.</p>
                <p>Simply click the below button, select your device (only Chrome & Edge supported), and then click
                    flash!</p>
                <p>You may need to install the USB-to-Serial driver first.</p>
            </div>
            <div className="mb-6">
                <p className="font-bold">If the installation fails (e.g. with "Invalid head of packet (0xff): Possible
                    serial noise or
                    corruption."), please try a different USB cable.</p>
            </div>
            <EspWebInstallButton manifest="/webflash/manifest.json"
                                 buttonText="Flash InfoOrbs DEV (Default)"/>
            <EspWebInstallButton manifest="/webflash/manifest-nofs.json"
                                 buttonText="Flash InfoOrbs DEV (Keep Filesystem/CustomClocks)"/>
            {/*<EspWebInstallButton manifest="/webflash/manifest.json"*/}
            {/*                     buttonText="Flash InfoOrbs DEV (all Widgets)"/>*/}
            <div className="mt-6">
                You can download the source code and report issues in our&nbsp;
                <Link className="link" target="_blank" to="https://github.com/brettdottech/info-orbs">
                    GitHub repo
                </Link>.
            </div>
        </div>
    );
};

export default WebFlashPage;