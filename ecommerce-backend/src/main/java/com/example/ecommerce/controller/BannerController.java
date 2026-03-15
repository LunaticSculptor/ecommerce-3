package com.example.ecommerce.controller;

import com.example.ecommerce.model.Banner;
import com.example.ecommerce.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BannerController {

    private final BannerRepository bannerRepository;

    @GetMapping
    @Cacheable("banners")
    public List<Banner> getBanners() {
        return bannerRepository.findAll();
    }
}
