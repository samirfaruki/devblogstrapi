import React, { useEffect, useState } from 'react';
import { Alert } from '@strapi/design-system';
import { Table, Thead, Th, Tr, Td, Tbody } from '@strapi/design-system/Table'
import { Box, Typography, BaseCheckbox, Loader, Link, IconButton, Flex } from '@strapi/design-system'
import axios from 'axios';
import { Pencil, Trash, Plus } from '@strapi/icons';

const COL_COUNT = 5;
const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [alert, setAlert] = useState(undefined)

  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(undefined);
    }, 5000)
  }

  const createProject = async (repo) => {
    const response = await axios.post("/github-projects/project", repo);
    console.log(response);
    if (response && response.data) {
      setRepos(repos.map((item) => item.id !== repo.id ? item : {
        ...item,
        projectId: response.data.id
      }
      )
      );
      showAlert({
        title: "Project creatted",
        message: `SUcessfully created project ${response.data.title}`,
        variant: "success"
      });
    } else {
      showAlert({
        title: "An error occured",
        message: " Error creating the project. Please retry ",
        variant: "danger"
      })
    }

  };

  const deletedProject = async (repo) => {
    const { projectId } = repo;
    const response = await axios.delete(`/github-project/project/${projectId}`);
    console.log(response)
  }

  useEffect(async () => {
    setLoading(true)
    axios.get("/github-projects/repos").then((response) => setRepos(response.data))
      .catch((error) => setError(error));
    setLoading(false)
  }, []);
  if (error) return (
    <Alert closeLabel="Close alert" title="Error fetch repositories" variant="danger">
      {error.toString()}


    </Alert>
  )
  if (loading) return <Loader />
  console.log(repos);
  const allChecked = selectedRepos.length == repos.length
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;
  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: "absolute", top: 0, left: "14%", zIndex: 10 }}>
          <Alert closeLabel='close alert' title={alert.title} variant={alert.variant}>
            {alert.message}
          </Alert>
        </div>
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length} >
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox aria-label="Select all entries" value={allChecked} indeterminate={isIndeterminate}
                onValueChange={value => value ? setSelectedRepos(repos.map((repo) => repo.id)) : setSelectedRepos([])}
              />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => {
            const { id, name, shortDescription, url, projectId } = repo;
            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox
                    aria-label={`Select ${id}`}
                    value={selectedRepos && selectedRepos.includes(id)}
                    onValueChange={(value) => {
                      const newSelectedRepos = value
                        ? [...selectedRepos, id]
                        : selectedRepos.filter((item) => item !== id);
                      selectedRepos(newSelectedRepos);
                    }}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{<h3>shortDescription</h3>}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800"><Link href={url} isExternal={url}></Link></Typography>
                </Td>

                <Td>
                  {projectId ?
                    (<Flex>

                      <Link to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}>
                        <IconButton onClick={() => console.log('edit')} label="Edit" noBorder icon={<Pencil />} /></Link>
                      <Box paddingLeft={1}>
                        <IconButton onClick={() => deletedProject(repo)} label="Delete" noBorder icon={<Trash />} />
                      </Box>
                    </Flex>
                    ) :
                    (<IconButton onClick={() => createProject(repo)}
                      label="Add"
                      noBorder
                      icon={<Plus />} />)
                  }
                </Td>
              </Tr>)
          })}
        </Tbody>
      </Table>
    </Box>

  )
}

export default Repo;