import React from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

type RepositoryData = PackageData[];

type PackageData = {
  name: string;
  packageName: string;
  version: string;
  description: string;
  url: string;
  dependencies: string[];
  website: string;
};

function RepositoryTable(props: { data: RepositoryData }) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Name</th>
          <th>Package Name</th>
          <th>Version</th>
          <th>Description</th>
          <th>Links</th>
          <th>Dependencies</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((packageData) => (
          <tr key={packageData.name}>
            <td>{packageData.name}</td>
            <td>{packageData.packageName}</td>
            <td>{packageData.version}</td>
            <td>{packageData.description}</td>
            <td>
              {packageData.website !== undefined ? <><a style={{ color: 'lightblue' }} href={packageData.website}>Website</a>&nbr;</> : null}
              <a style={{ color: 'lightblue' }} href={packageData.url}>Download</a>
            </td>
            <td>{packageData.dependencies.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function App() {
  const [loading, setLoading] = React.useState(true);
  const [errorState, setErrorState] = React.useState(false);
  const [repositories, setRepositories] = React.useState<RepositoryData>([]);

  React.useEffect(() => {
    fetch("repository.json")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        setErrorState(true);
      })
      .then((data) => {
        setRepositories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorState(true);
      });
  }, []);

  return (
    <div className="App">
      <header style={{ color: 'white', textAlign: "center", fontSize: '22pt' }}>List of Nexus Packages available through this repository</header>
      {loading ? (
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : errorState ? (
        <div>Error occured.</div>
      ) : (
        <RepositoryTable data={repositories} />
      )}
    </div>
  );
}
