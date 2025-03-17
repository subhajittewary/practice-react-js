import { useState } from "react";
import NewProject from "./components/NewProject";
import ProjectSideBar from "./components/ProjectSideBar";
import NoProjectSelected from "./components/NoProjectSelected";
import SelectedProject from "./components/SelectedProject";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
  });

  const handleAddTask = (title) => {
    setProjectsState((prevState) => {
      const newTask = {
        id: Math.random().toString(),
        title,
        completed: false,
        projectId: prevState.selectedProjectId,
      };
      return {
        ...prevState,
        tasks: [...prevState.tasks, newTask],
      };
    });
  };

  const handleToggleComplete = (taskId) => {
    setProjectsState((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleDeleteTask = (taskId) => {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        tasks: prevState.tasks.filter((task) => task.id !== taskId),
      };
    });
  };

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleProjectSave(projectData) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: [...prevState.projects, projectData],
        tasks: [...prevState.tasks],
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleSelectProect(projectId) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: projectId,
      };
    });
  }

  function handleDeleteProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: prevState.projects.filter(
          (project) => project.id !== prevState.selectedProjectId
        ),
        selectedProjectId: undefined,
      };
    });
  }

  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );

  const tasksByProjectId = projectsState.tasks.filter(
    (task) => task.projectId === projectsState.selectedProjectId
  );

  let content = (
    <SelectedProject
      project={selectedProject}
      tasks={tasksByProjectId}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onToggleComplete={handleToggleComplete}
      onDeleteTask={handleDeleteTask}
    />
  );
  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject
        handleStartAddProject={handleStartAddProject}
        onAdd={handleProjectSave}
        onCancel={handleCancelAddProject}
      />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = (
      <NoProjectSelected handleStartAddProject={handleStartAddProject} />
    );
  }
  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectSideBar
        handleStartAddProject={handleStartAddProject}
        projects={projectsState.projects}
        onProjectSelect={handleSelectProect}
        selectedProjectId={projectsState.selectedProjectId}
      />
      {content}
    </main>
  );
}

export default App;
