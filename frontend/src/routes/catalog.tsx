import axios from "axios";

import {API_URL} from "../config.ts";
import {useQuery} from "@tanstack/react-query";

function Catalog() {
  const {isPending, error, data, isFetching} = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      axios
        .get(`${API_URL}/catalogs`)
        .then((res) => res.data),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h2>Catalog</h2>
      <p>{API_URL}</p>
      <ul>
        {data.results[0].description}
      </ul>
      <div>{isFetching ? 'Updating...' : ''}</div>
    </div>
  );
}

export default Catalog;
