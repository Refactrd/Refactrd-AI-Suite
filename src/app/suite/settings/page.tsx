export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1f2a44", fontFamily: "serif" }}
          >
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9aa5b4" }}>
            Suite configuration and preferences
          </p>
        </div>

        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d0d8e4",
          }}
        >
          <p className="text-sm" style={{ color: "#9aa5b4" }}>
            Settings coming in a later phase.
          </p>
        </div>
      </div>
    </div>
  );
}