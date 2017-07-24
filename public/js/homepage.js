const snippets = document.querySelector(".snippets")

function snippetListing(snippet) {
  let tags = []
  for (var i = 0; i < snippet.tags.length; i++) {
    const tag = snippet.tags[i]
    tags.push(`<h5 class="tag">${tag}</h5>`)
  }
  return `
  <div class="snippet-title">
  <h3 id="${snippet._id}" class="title">${snippet.title}</h3>
  <h4 class="language">${snippet.language}</h4>
  <div class="tags">
  <h5>Tags: </h5>${tags}
  </div>
  </div>
  `
}

function displaySnippet(snippet) {
  let tags = []
  for (var i = 0; i < snippet.tags.length; i++) {
    const tag = snippet.tags[i]
    tags.push(`<h5 class="tag">${tag} <form class="deleteTag" action="" method="delete"> <input class="delete" id="${snippet._id}" type="submit" name="${tag}" value="x"></form> </h5>`)
  }
  return `
  <div class="snippet">
  <h2 class="title">${snippet.title}</h2>
  <h3 class="language">${snippet.language}</h3>
  <div class="code">
  ${snippet.body}
  </div>
  <div class="tags">
  <h5>Tags: </h5>${tags}
  </div>
  </div>
  `
}

function getTitles() {
  const titles = document.querySelectorAll(".title")
  for (var i = 0; i < titles.length; i++) {
    const title = titles[i]
    const snippetId = title.id
    title.addEventListener('click', function(event) {
      fetchSnippet(snippetId)
    })
  }
}

function getLanguages() {
  const languages = document.querySelectorAll(".language")
  for (var i = 0; i < languages.length; i++) {
    const language = languages[i]
    const snippetLanguage = language.textContent
    language.addEventListener('click', function(event) {
      fetchLanguage(snippetLanguage)
    })
  }
}

function getTags() {
  const tags = document.querySelectorAll(".tag")
  for (var i = 0; i < tags.length; i++) {
    const tag = tags[i]
    const tagContent = tag.textContent
    tag.addEventListener('click', function(event) {
      fetchTag(tagContent)
    })
  }
}

function deleteTag() {
  const deleteTagButtons = document.querySelectorAll("form.deleteTag")
  console.log("sup", deleteTagButtons);
  for (var i = 0; i < deleteTagButtons.length; i++) {
    const deleteTagButton = deleteTagButtons[i]
    deleteTagButton.addEventListener("submit", function(event) {
      event.preventDefault()
      console.log("clicked");
      const tag = deleteTagButton.querySelector(".delete").name
      const snippetId = deleteTagButton.querySelector(".delete").id
      const formData = {
        tag: tag
      }
      fetch(`/api/snippets/${snippetId}/tags`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(formData),
        headers: {
               "content-type": "application/json"
             }
      })
      .then(function(res) {
        return res.json()
      })
      .then(function(json) {
        fetchSnippet(snippetId)
      })
    })
  }
}

function fetchSnippets() {
  snippets.textContent = ""
  fetch('/api/snippets', {
    credentials: "include"
  })
  .then(function(res) {
    return res.json()
  })
  .then(function(json) {
    for (var i = 0; i < json.snippets.length; i++) {
      const snippet = json.snippets[i]
      const html = snippetListing(snippet)
      snippets.insertAdjacentHTML("beforeend", html)
    }
    getTitles()
    getLanguages()
    getTags()
  })
}

function fetchSnippet(id) {
  snippets.textContent = ""
  fetch(`/api/snippets/${id}`, {
    credentials: "include"
  })
  .then(function(res) {
    return res.json()
  })
  .then(function(json) {
    const snippet = json.snippet
    const html = displaySnippet(snippet)
    snippets.insertAdjacentHTML("beforeend", html)
    getTitles()
    getLanguages()
    getTags()
    deleteTag()
  })
  }

  function fetchLanguage(language) {
    snippets.textContent = ''
    fetch(`/api/snippets?language=${language}`, {
      credentials: "include"
    })
    .then(function(res) {
      return res.json()
    })
    .then(function(json) {
      for (var i = 0; i < json.snippets.length; i++) {
        const snippet = json.snippets[i]
        const html = snippetListing(snippet)
        snippets.insertAdjacentHTML("beforeend", html)
      }
      getTitles()
      getLanguages()
      getTags()

    })
  }

  function fetchTag(tag) {
    snippets.textContent = ""
    fetch(`/api/snippets?tag=${tag}`, {
      credentials: "include"
    })
    .then(function(res) {
      return res.json()
    })
    .then(function(json) {
      for (var i = 0; i < json.snippets.length; i++) {
        const snippet = json.snippets[i]
        const html = snippetListing(snippet)
        snippets.insertAdjacentHTML("beforeend", html)
      }
      getTitles()
      getLanguages()
      getTags()
    })
  }


if (snippets) {
  fetchSnippets()
}
