const newSnippet = document.querySelector("form.new-snippet")
newSnippet.addEventListener('submit', function(event) {
  event.preventDefault()
  const formData = {
    title: document.querySelector("#title").value,
    language: document.querySelector("#language").value,
    body: document.querySelector("#body").value,
    tag: document.querySelector("#tag").value
  }

  fetch("/api/snippets", {
    method: "POST",
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
    window.location.replace("/")
  })
})
