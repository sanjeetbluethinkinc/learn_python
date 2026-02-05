import { useEffect, useState } from "react";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASEURL}/api/about/section/`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data || !data.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No content available
      </div>
    );
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${BASEURL}${data.background_image})`,
        }}
      >
        <div className="bg-black/60">
          <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT TEXT */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {data.title}
              </h1>
              <p className="text-gray-200 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>

            {/* RIGHT ORANGE BOX */}
            <div className="bg-orange-500 rounded-lg p-8 space-y-4">
              {[data.point_1, data.point_2, data.point_3, data.point_4].map(
                (point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      ✓
                    </span>
                    <p className="font-medium">{point}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm uppercase font-semibold text-gray-500 mb-2">
            {data.story_label}
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            {data.story_title}
          </h2>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
