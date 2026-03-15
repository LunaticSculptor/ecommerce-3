package com.example.ecommerce.config;

import com.example.ecommerce.model.Banner;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.BannerRepository;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setEmail("test@gmail.com");
            defaultUser.setPassword("123456");
            defaultUser.setName("Test User");
            userRepository.save(defaultUser);

            // Categories
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setSlug("electronics");
            electronics.setImageUrl("https://placehold.co/100x100?text=Electronics");
            categoryRepository.save(electronics);

            Category fashion = new Category();
            fashion.setName("Fashion");
            fashion.setSlug("fashion");
            fashion.setImageUrl("https://placehold.co/100x100?text=Fashion");
            categoryRepository.save(fashion);

            Category home = new Category();
            home.setName("Home");
            home.setSlug("home");
            home.setImageUrl("https://placehold.co/100x100?text=Home");
            categoryRepository.save(home);

            // Banners
            Banner b1 = new Banner();
            b1.setTitle("Summer Sale");
            b1.setImageUrl("https://placehold.co/800x400?text=Summer+Sale");
            b1.setCategoryLink("/products?category=fashion");
            bannerRepository.save(b1);

            Banner b2 = new Banner();
            b2.setTitle("Tech Gadgets");
            b2.setImageUrl("https://placehold.co/800x400?text=Tech+Gadgets");
            b2.setCategoryLink("/products?category=electronics");
            bannerRepository.save(b2);

            // Products
            for (int i = 1; i <= 20; i++) {
                Product p = new Product();
                p.setName("Product " + i);
                p.setDescription("Description for product " + i);
                p.setPrice(new BigDecimal(10 * i));

                // Set fake original price for some items to show discount badge
                if (i % 3 == 0) {
                    p.setOriginalPrice(new BigDecimal(15 * i));
                }

                p.setRating(3.5 + (Math.random() * 1.5)); // Random between 3.5 and 5.0
                p.setReviewCount(10 + i);
                p.setBrand("Brand " + (i % 5));
                p.setInStock(i % 10 != 0); // 1 in 10 is out of stock
                p.setStockQuantity(p.getInStock() ? 50 : 0);
                p.setFeatured(i % 4 == 0); // 1 in 4 is featured

                if (i % 2 == 0) {
                    p.setCategory(electronics);
                } else if (i % 3 == 0) {
                    p.setCategory(home);
                } else {
                    p.setCategory(fashion);
                }

                p.setImageUrls(Arrays.asList(
                        "https://placehold.co/400x500?text=Product+" + i,
                        "https://placehold.co/400x500?text=View+2",
                        "https://placehold.co/400x500?text=View+3"));
                p.setAvailableColors(Arrays.asList("Black", "Blue", "White"));
                productRepository.save(p);
            }
        }
    }
}
