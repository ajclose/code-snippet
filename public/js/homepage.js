const snippets = document.querySelector(".snippets")
function fetchSnippets() {
  snippets.textContent = ""
  fetch('/api/snippets', {
    credentials: "include"
  })
  .then(function(res) {
    return res.json()
  })
  .then(function(json) {
    console.log(json.snippets)
    for (var i = 0; i < json.snippets.length; i++) {
      const snippet = json.snippets[i]
      console.log(snippet);
      const html = `
      <div class="snippet-title">
      <h3 id="${snippet._id}" class="title">${snippet.title}</h3>
      <h4>Language: ${snippet.language}</h4>
      <h5>Tags: ${snippet.tags}</h5>
      </div>
      `
      snippets.insertAdjacentHTML("beforeend", html)
    }
    const titles = document.querySelectorAll(".title")
    for (var i = 0; i < titles.length; i++) {
      const title = titles[i]
      const snippetId = title.id
      title.addEventListener('click', function(event) {
        fetchSnippet(snippetId)
      })

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


if (snippets) {
  fetchSnippets()
}
