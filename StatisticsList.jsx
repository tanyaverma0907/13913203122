export default function StatisticsList({ data }) {
  if (!data.length) {
    return (
      <p className="text-center text-gray-500">No statistics available.</p>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="border border-gray-300 rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-700 break-words">
            {window.location.origin}/{item.shortCode}
          </h2>

          <p className="text-gray-700">
            <span className="font-semibold">Original URL: </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {item.url}
            </a>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Created: {new Date(item.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Expires: {new Date(item.expiry).toLocaleString()}
          </p>

          <p className="mt-2 font-semibold text-gray-800">
            Total Clicks: {item.clicks.length}
          </p>

          {item.clicks.length > 0 ? (
            <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-200 pt-2">
              <table className="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr>
                    <th className="pb-1">Timestamp</th>
                    <th className="pb-1">Source</th>
                    <th className="pb-1">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {item.clicks.map((click, cidx) => (
                    <tr
                      key={cidx}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="py-1">
                        {new Date(click.timestamp).toLocaleString()}
                      </td>
                      <td className="py-1">{click.source || "Unknown"}</td>
                      <td className="py-1">{click.geo || "Unknown"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-1 italic text-gray-500">No clicks recorded yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
