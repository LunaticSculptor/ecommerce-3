package com.example.ecommerce.controller;

import com.example.ecommerce.model.Category;
import com.example.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    @Cacheable("categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }
}
