import Footer from "~/components/Footer";
import { routes } from "~/router";

function Index() {
  const IndexArr = routes.slice(1).map((r) => ({
    id: r.id || "",
    path: r.path || "",
    pathName: r.path?.slice(1) || "",
  }));

  return (
    <div className="flex items-center mt-32 flex-col">
      <ul>
        {IndexArr.map((i) => (
          <li key={i.pathName}>
            <a
              href={i.path}
              className="inline-block text-gray-400 ease-in duration-100 hover:text-gray-600 hover:scale-105"
            >
              <span className="opacity-60">{i.pathName}</span> <span>{i.id}</span>
            </a>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default Index;
