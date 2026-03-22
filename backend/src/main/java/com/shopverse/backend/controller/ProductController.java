package com.shopverse.backend.controller;

import com.shopverse.backend.model.Product;
import com.shopverse.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService service;

    @Autowired
    private ProductService productService;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // ================= ADD PRODUCT =================
    @PostMapping
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("image") MultipartFile file) throws Exception {

        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File destination = new File(uploadDir + fileName);
        file.transferTo(destination);

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setImage(fileName);

        return service.addProduct(product);
    }

    // ================= GET ALL PRODUCTS =================
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return service.addProduct(product);
    }
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam(required = false) String keyword) {
        return productService.searchProducts(keyword);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}