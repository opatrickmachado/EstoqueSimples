let products = [];

function showMessage(text) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = text;

    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
        messageElement.textContent = "";
    }, 3000);
}

function addProduct() {
    const name = document.getElementById("productName").value;
    const quantity = parseInt(document.getElementById("productQuantity").value);
    const image = document.getElementById("productImage").files[0]; // Adicione isto

    if (name && quantity && image) {
        // Convertemos a imagem em uma URL para ser mostrada
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = function () {
            const product = {
                id: Date.now(),
                name: name,
                quantity: quantity,
                image: reader.result,
            };
            products.push(product);
            renderProducts(products);
            showMessage("Produto adicionado com sucesso!");
            setLocalData("products", products);
        };
    } else {
        showMessage("Preencha todos os campos!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#addProductForm button")
        .addEventListener("click", addProduct);

    document
        .querySelector("#searchProductForm button")
        .addEventListener("click", searchProduct);
    const storedProducts = getLocalData("products");
    if (storedProducts) {
        products = storedProducts;
        renderProducts(products);
    }
});

function searchProduct() {
    const searchName = document.getElementById("searchProductName").value;
    if (!searchName) {
        renderProducts(products);
        return;
    }

    const filteredProducts = products.filter((p) =>
        p.name.includes(searchName)
    );
    renderProducts(filteredProducts);
}

function renderProducts(productsToRender) {
    const tbody = document
        .getElementById("productsTable")
        .querySelector("tbody");
    tbody.innerHTML = "";

    productsToRender.forEach((product) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", product.id); // Adicione um identificador

        row.innerHTML = `
            <td class="productImage"><img src="${product.image}" alt="${product.name}" width="50" height="50"></td>
            <td class="productName">${product.name}</td>
            <td class="productQuantity">${product.quantity}</td>
            <td class="productActions">
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function editProduct(productId) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    // Encontre a linha do produto na tabela
    const tbody = document
        .getElementById("productsTable")
        .querySelector("tbody");
    const productRow = tbody.querySelector(`[data-id="${productId}"]`);

    // Converta as células em campos de entrada
    const nameCell = productRow.querySelector(".productName");
    nameCell.innerHTML = `<input type="text" value="${product.name}" />`;

    const quantityCell = productRow.querySelector(".productQuantity");
    quantityCell.innerHTML = `<input type="number" value="${product.quantity}" />`;

    const imageCell = productRow.querySelector(".productImage");
    imageCell.innerHTML = `<input type="file" accept="image/*" />`;

    // Altere os botões
    const actionsCell = productRow.querySelector(".productActions");
    actionsCell.innerHTML = `
        <button onclick="saveProduct(${product.id})">Salvar</button>
        <button onclick="cancelEdit(${product.id})">Cancelar</button>
    `;
}

function saveProduct(productId) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    const tbody = document
        .getElementById("productsTable")
        .querySelector("tbody");
    const productRow = tbody.querySelector(`[data-id="${productId}"]`);

    const newName = productRow.querySelector(".productName input").value;
    product.name = newName;

    const newQuantity = productRow.querySelector(
        ".productQuantity input"
    ).value;
    product.quantity = parseInt(newQuantity);

    const newImage = productRow.querySelector(".productImage input").files[0];
    if (newImage) {
        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onloadend = function () {
            product.image = reader.result;
            finalizeEdit();
        };
    } else {
        finalizeEdit();
    }

    function finalizeEdit() {
        renderProducts(products);
        showMessage("Produto editado com sucesso!");
        setLocalData("products", products);
    }
}

function cancelEdit(productId) {
    renderProducts(products); // Simplesmente re-renderiza a tabela sem salvar as mudanças
}

function deleteProduct(productId) {
    products = products.filter((p) => p.id !== productId);
    renderProducts(products);
    showMessage("Produto excluído com sucesso!");
    setLocalData("products", products);
}

function setLocalData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalData(key) {
    const storedData = localStorage.getItem(key);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return null;
}
