const snippets = document.querySelector(".snippets")

function snippetListing(snippet) {
  let tags = []
  console.log("tags", snippet.tags[0].split(''));
  for (var i = 0; i < snippet.tags.length; i++) {
    const tag = snippet.tags[i]
    console.log(tag);
    tags.push(`<h5 class="tag">${tag}</h5>`)
  }
  console.log(tags);
  return `
  <div class="snippet-title">
  <h3 id="${snippet._id}" class="title">${snippet.title}</h3>
  <h4 class="language">${snippet.language}</h4>
  <h5>Tags: </h5>${tags}
  </div>
  `
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
    const titles = document.querySelectorAll(".title")
    for (var i = 0; i < titles.length; i++) {
      const title = titles[i]
      const snippetId = title.id
      title.addEventListener('click', function(event) {
        fetchSnippet(snippetId)
      })
      const languages = document.querySelectorAll(".language")
      for (var i = 0; i < languages.length; i++) {
        const language = languages[i]
        const snippetLanguage = language.textContent
        language.addEventListener('click', function(event) {
          fetchLanguage(snippetLanguage)
        })
      }
    }
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
    const html = `
    <div class="snippet">
    <h2>${snippet.title}</h2>
    <h3>${snippet.language}</h3>
    <div class="code">
    ${snippet.body}
    </div>
    <h4>${snippet.tags}</h4>
    </div>
    `
    snippets.insertAdjacentHTML("beforeend", html)
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
      console.log(json);
      for (var i = 0; i < json.snippets.length; i++) {
        const snippet = json.snippets[i]
        const html = snippetListing(snippet)
        snippets.insertAdjacentHTML("beforeend", html)
      }
    })
  }


if (snippets) {
  fetchSnippets()
}
