import { useEffect, useState } from "react";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function HomeSection() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`${BASEURL}/api/home/sections/`)
      .then((res) => res.json())
      .then((data) => setSections(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`grid md:grid-cols-2 gap-10 items-center
            ${index % 2 === 1 ? "md:flex-row-reverse" : ""}
          `}
        >
          {/* IMAGE */}
          <div>
           <img
  src={`${BASEURL}${section.image}`}
  alt={section.title}
  className="rounded-xl w-full object-cover"
/>
          </div>

          {/* TEXT */}
          <div>
            <h5 className="text-sm uppercase text-orange-500 font-semibold mb-2">
              {section.subtitle}
            </h5>

            <h2 className="text-3xl font-bold mb-4">
              {section.title}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              {section.description}
            </p>

            {section.button_link && (
              <a
                href={section.button_link}
                className="inline-block bg-orange-500 text-white
                           px-6 py-3 rounded-lg font-semibold
                           hover:bg-orange-600 transition"
              >
                {section.button_text}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeSection;
