// Define API URLs
const apiUrl = 'http://localhost:5678/api/works';
const apiCategoriesUrl = 'http://localhost:5678/api/categories';

// **********Function to fetch data from the API********
async function fetchData(apiUrl) {
  try {
    // Make an API request
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Throw an error for an unsuccessful response
      throw new Error('Failed to fetch data');
    }
    // Parse JSON data from the response
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      // Throw an error if the data is not found or not in the expected format
      throw new Error('Data not found');
    }
    // Return the fetched data
    return data;
  } catch (error) {
    // Handle and log any errors
    console.error('Error fetching data:', error);
    throw error;
  }
}

// ********Function to fetch categories from the API********
async function fetchCategories(apiUrl) {
  try {
    // Make an API request to fetch categories
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Throw an error for an unsuccessful response
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw Error('Categories not found');
    }
    // Return the fetched categories
    return data;
  } catch (error) {
    // Handle and log any errors
    console.error('Error fetching categories:', error);
    throw error;
  }
}

//********** Function to populate the gallery with projects************
function populateGallery(projects) {
  // Get the gallery element from the DOM
  const gallery = document.querySelector('.gallery');
  // Clear the gallery content
  gallery.innerHTML = '';
  // Loop through each project and create elements for display
  projects.forEach((project) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    // Set the image source/URL
    img.src = project.imageUrl;
    img.alt = project.title;
    // Set a data attribute for the project ID
    img.setAttribute('data-id', project.id);
    const figcaption = document.createElement('figcaption');
    // Set the title in the caption
    figcaption.textContent = project.title;
    figure.appendChild(img);// Append the image to the figure element
    figure.appendChild(figcaption);// Append the caption to the figure element
    gallery.appendChild(figure);// Append the figure to the gallery
  });
}

//************ Define an async function to fetch data and populate the gallery***********
async function fetchAndPopulateGallery() {
  try {
        const projects = await fetchData(apiUrl);// Fetch works data
    // Create Category Filters
    const categories = await fetchCategories(apiCategoriesUrl);
    populateGallery(projects);
    // Create a category menu for filtering projects
    const categoriesMenu = document.querySelector('.categories');
    const liAll = document.createElement('li');
    liAll.textContent = 'All';
    liAll.setAttribute('data-category', 'all');
    categoriesMenu.appendChild(liAll);
    // Create list items for each category
    categories.forEach((category) => {
      const li = document.createElement('li');
      li.textContent = category.name;
      li.setAttribute('data-category', category.id);
      categoriesMenu.appendChild(li);
  });
  // Add click event listeners to category items for filtering
  const categoryItems = document.querySelectorAll('.categories li');
  categoryItems.forEach((item) => {
    item.addEventListener('click', async () => {
      const selectedCategory = item.getAttribute('data-category');
      if (selectedCategory === 'all') {
        // Display all projects when "All" is selected
        populateGallery(projects);
      } else {
        // Display projects filtered by category
        const filteredProjects = projects.filter(
          (project) => project.categoryId === parseInt(selectedCategory)
        );
        populateGallery(filteredProjects);
      }
    });
  });
} catch (error) {
  console.error('Error initializing the app:', error);
}
}
fetchAndPopulateGallery();  // Call the async function to start the process

 // ***********Function to show the edit icon and modal********
function showEditIconAndModal() {
  console.log('Function is running');

  const openModalIcon = document.getElementById('openModalIcon');
  const editIcon = document.getElementById('editIcon');
  const modifierText = document.getElementById('modifierText');
  const modifierText2 = document.getElementById('modifierText2');
  const closeModal = document.getElementById('closeModal');
  const openSecondModalButton = document.getElementById('openSecondModal');
  const closeSecondModalButton = document.getElementById('closeSecondModal');
  const backArrowIcon = document.getElementById('backArrowIcon');
  const myModal = document.getElementById('myModal');
  const secondModal = document.getElementById('secondModal');
  const modalImageContainer = document.getElementById('modalImageContainer');
  //********Function to open the first modal********
  function openModal() {
    myModal.style.display = 'block';
    modalImageContainer.innerHTML = '';
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach((image, index) => {
      const clonedImage = image.cloneNode(true);
      clonedImage.style.width = '76px';
      clonedImage.style.height = '102px';
      if (index < galleryImages.length - 1) {
        clonedImage.style.marginRight = '10px';
      }
   // Create a container for each image with delete and edit options
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      const projectId = image.getAttribute('data-id');
      imageContainer.setAttribute('data-id', projectId);
      imageContainer.appendChild(clonedImage);
  // Create a delete icon
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('delete-icon', 'fa', 'fa-trash');
      imageContainer.appendChild(deleteIcon);
  // Create an "éditer" text element
      const editText = document.createElement('p');
      editText.textContent = 'éditer';
      imageContainer.appendChild(editText);
      // Add the container to the modal
      modalImageContainer.appendChild(imageContainer);
    });
  // Add click event listeners to delete icons
    const deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach((deleteIcon) => {
      deleteIcon.addEventListener('click', handleDeleteIconClick);
    });
  }
  //******** Function to open the second modal*******
  function openSecondModal() {
    secondModal.style.display = 'block';
    myModal.style.display = 'none';
  }
 //******** Function to close the second modal ******
  function closeSecondModal() { 
    secondModal.style.display = 'none';
    myModal.style.display = 'block';
  }
  // Add event listeners for opening,backarrow and closing the second modal
  openModalIcon.addEventListener('click', openModal);
  editIcon.addEventListener('click', openModal);
  modifierText.addEventListener('click', openModal);
  modifierText2.addEventListener('click', openModal);
  closeModal.addEventListener('click', () => closeModalFunction(myModal));
  openSecondModalButton.addEventListener('click', openSecondModal);
  closeSecondModalButton.addEventListener('click', closeSecondModal);
  backArrowIcon.addEventListener('click', closeSecondModal);
 // Event listener to close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    if (myModal && (event.target === myModal || myModal.contains(event.target))) {
      console.log('Clicked inside myModal');
      closeModalFunction(myModal);
    } else if (secondModal && event.target === secondModal) {
      console.log('Clicked inside secondModal');
      closeModalFunction(secondModal);
    }    
  });
  function closeModalFunction(modal) {//Function to close the modal
    console.log('Closing modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  closeModalFunction(myModal); // To close myModal
closeModalFunction(secondModal); // To close secondModal
}
// Call the setupModals function to set up modal functionality
showEditIconAndModal();

  // ***********Function to handle file input change***********
   function handleFileInputChange(event) {
    // Get the file input element
   const fileInput = event.target;  
   const selectedFile = event.target.files[0];  // Get the first selected file from the input
   // Check if a file is selected
   if (selectedFile) {
       const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB
        // Check if the selected image is too large
    if (selectedFile.size > maxSizeInBytes) {
      alert('Selected image is too large. Please choose a smaller image.');
      fileInput.value = '';
    } else {
      // Display the selected photo
      displaySelectedPhoto(selectedFile);
           }
  }else{
    console.error('no file selected');
  }
}
// Event listener for the file input
const buttonAddPhoto = document.getElementById('buttonAddPhoto');
buttonAddPhoto.addEventListener('change', handleFileInputChange);

//********Function to display the selected photo in the second modal*********
function displaySelectedPhoto(file) {
  //  const photoContainer = document.getElementById('photoContainer');
   const viewPicture = document.getElementById('viewPicture');
   const closeIconContainer = document.getElementById('closeIconContainer');
   
   // Create an image element to display the selected file
    const photoElement = document.createElement('img');
    // Set the source of the image to the selected file
    photoElement.src = URL.createObjectURL(file);     
    // Clear and update the viewPicture container with the selected image
    viewPicture.innerHTML = '';
    viewPicture.appendChild(photoElement);
    // Display the close icon container
     closeIconContainer.style.display = 'block';
   // Hide any error messages
     const error2 = document.querySelector('.error2');
     error2.style.display = 'none';
   // Hide certain labels
   const labels = document.querySelectorAll(
     'label[for="buttonAddPhoto"], label#buttonAddPhotoAspect, label.pictureFormat'
   );
   labels.forEach((label) => {
     label.style.display = 'none';
   });
   // Get a reference to the close icon
const closeIcon = document.querySelector('.fa.fa-times.close-icon');
// Add a click event listener to the close icon
  closeIcon.addEventListener('click', function() {
  // Remove the displayed image
  const displayedImage = viewPicture.querySelector('img');
  if (displayedImage) {
    displayedImage.remove();
  }
  // Hide the close icon container
  closeIconContainer.style.display = 'none';
  // Clear the file input value
  buttonAddPhoto.value = '';
   
  // Show the labels
  const labels = document.querySelectorAll(
    'label[for="buttonAddPhoto"], label#buttonAddPhotoAspect, label.pictureFormat'
  );
  labels.forEach((label) => {
    label.style.display = 'block';    
  });
 });
}
//********** Function to handle delete icon click***********
  async function handleDeleteIconClick(event) {
  event.preventDefault();
  const imageContainer = event.target.parentElement;
  const projectId = imageContainer.getAttribute('data-id');
  const token = localStorage.getItem('authToken');
  // to delete the work in gallery
  try {
    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
      console.log('Project deleted successfully.');
      // Remove the image container from the DOM
      imageContainer.remove();
    } else {
      console.error('Error deleting project:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
  }
 }  
 document.addEventListener('DOMContentLoaded', async () => {
  //***********Function for login ***********
    const loginButton = document.getElementById('login-button');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const photoInput = document.getElementById('buttonAddPhoto');
    photoInput.addEventListener('change', handleFileInputChange);
 
    if (isLoggedIn) {
      // User is logged in, update UI accordingly
      loginButton.textContent = 'Logout';
      // Hide the main navigation bar
      const navBar = document.querySelector('.main-nav');
      navBar.style.display = 'none';
      // Show the top bar
        const topBar = document.querySelector('.topbar');
      topBar.classList.remove('hidden');
      // Show the edit icon and modal for logged-in users
       showEditIconAndModal();
 
      // Show the "modifierText" and "modifierText2" elements
      const modifierText = document.getElementById('modifierText');
      modifierText.style.display = 'inline';
      const modifier = document.getElementById('modifierText2');
      modifier.style.display = 'inline';
    } else {
      // User is not logged in, update UI accordingly
      loginButton.textContent = 'Login';
 
      // Show the main navigation bar
      const navBar = document.querySelector('.main-nav');
      navBar.style.display = 'block';
 
      // Hide elements related to editing for non-logged-in users
      const openModalIcon = document.getElementById('openModalIcon');
      const editIcon = document.getElementById('editIcon');
      const modifierText = document.getElementById('modifierText');
      const modifier = document.getElementById('modifierText2');
     
      openModalIcon.style.display = 'none';
      editIcon.style.display = 'none';
      modifierText.style.display = 'none';
      modifier.style.display = 'none';
 
      // Handle the click event for the login button
      loginButton.addEventListener('click', () => {
        // Redirect to the login page
        window.location.href = './login.html';
      });
    }
    //********Function to submit form ********
    const buttonModalSubmit = document.getElementById('buttonModalSubmit');
    buttonModalSubmit.addEventListener('click', handleAddProjectFormSubmit);

    async function handleAddProjectFormSubmit(event) {
      event.preventDefault(); // Prevent the default form submission

      const titleInput = document.getElementById('titleInput').value;
      const categoryInput = document.getElementById('categoryInput').value;
      const selectedFile = document.getElementById('buttonAddPhoto').files[0]; // Get the selected file
      const token = localStorage.getItem('authToken');
      const error2 = document.querySelector('.error2');
      
      if (!titleInput || categoryInput === 'default'|| !selectedFile) {
        error2.style.display = 'block';
        error2.textContent = 'Please fill in all required fields.';
        return;
      }   
      const formData = new FormData();
      formData.append('title', titleInput);
      formData.append('category', categoryInput);
      formData.append('image', selectedFile);   
      try {
          const response = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });   
        if (response.ok) {
          buttonAddPhoto.value = '';
          const viewPicture = document.getElementById('viewPicture');
          const selectedImage = viewPicture.querySelector('img');
          if (selectedImage) {
            const clonedImage = selectedImage.cloneNode(true);
            console.log('Cloned image:', clonedImage);
            const gallery = document.querySelector('.gallery');
            gallery.appendChild(clonedImage);
            console.log('Image added to gallery:', clonedImage);   
            // Call populateGallery again with the updated list of projects
            const updatedProjects = await fetchData(apiUrl);
            populateGallery(updatedProjects);
          }
          const closeSecondModalButton = document.getElementById('closeSecondModal');
          closeSecondModalButton.addEventListener('click', closeSecondModal);

        } else {
          console.error('Error adding project:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding project:', error);
      }
    } 
 }); 