const Projects = require('./main.projects.json')

const Formatted = Projects.map((project) => {
  return {
    CÓDIGO: project.nome,
  }
})
