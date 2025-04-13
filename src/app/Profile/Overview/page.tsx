import ProfileMainOverview from "../pOverviewMain.jsx"
import ProfileActivityOverview from "../pOverviewActivity.jsx"
export default function pOverview() {
    return (
        <>
            <div className="contentContainer">
                <section className="pAnimelistMain overview">
                    <ProfileActivityOverview></ProfileActivityOverview>
                    <ProfileMainOverview></ProfileMainOverview>
                </section>
            </div>
        </>
    );
}
