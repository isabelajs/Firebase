let  auth = firebase.auth();
let db = firebase.firestore()

//crear un nuevo usuario
const signupForm = document.querySelector("#signup-form");
//ingreso del usuario
const signinForm = document.querySelector("#signin-form");
//cerrar sesión
const logout = document.querySelector("#logout")
//post
const postList = document.querySelector(".posts");

const googleButton = document.querySelector("#google");

//lista de posts en la base de datos se añade al html
const setupPosts = data =>{
  if(data.length){
    let html = "";
    data.forEach(doc => {
      const post = doc.data()
      const li = `
        <li class="list-group-item list-group-item-action">
          <h5>${post.title}</h5>
          <p>${post.description}</p>
        </li>
      `;   
      html += li;  
    });
    postList.innerHTML += html;
  }else{
    postList.innerHTML = `<p class = "text-center">Login to see posts</p>`
  }
}

//crear un nuevo usuario
signupForm.addEventListener("submit",async(e)=>{
  e.preventDefault();
  let email = document.getElementById("signup-email").value
  let password = document.getElementById("signup-password").value
  
  //autentifico con un correo y una contraseña
  auth
      .createUserWithEmailAndPassword(email,password)
        .then(userCredential=>{
          // limpia el formulario
          signupForm.reset()
          //cierro el formulario
          $('#signupModal').modal('hide')
          var user = userCredential.user;
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
        })
}) 

//ingreso del usuario
signinForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  let email = document.querySelector("#signin-email").value
  let password = document.querySelector("#signin-password").value

  auth
    .signInWithEmailAndPassword(email, password)
      .then((userCredential)=>{
        //escondo el modal
        $('#signinModal').modal('hide')
        var user = userCredential.user;
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
      });
})

//para salir de la sesión de usuario
logout.addEventListener("click", async()=>{
  auth.signOut()
    .then(()=>{
      console.log("cerramos sesión");
    })
    .catch((error)=>{
      console.log(error);
    })


})

// Login with Google
googleButton.addEventListener("click", (e) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("google sign in");
  })
  .catch(err => {
    console.log(err);
  })
});


//conocer el estado del usuario 
auth.onAuthStateChanged ((user)=>{
  if(user){
    db.collection("posts").get()
      .then(snapshot =>{
        setupPosts(snapshot.docs)
      }) 
    console.log("ingreso");
  }else{
    setupPosts([])
    console.log("no ingreso");
  }
})


// fire auth me dice que la contraseña no puede ser menor a 6 números
//tambien identifica si el correo electronico esta mal escrito
