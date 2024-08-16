package com.saessakmaeul.bitamin.config;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import org.springframework.core.convert.converter.Converter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowedOrigins("http://localhost:5174","http://localhost:5173", "http://localhost:3000", "https://i11b105.p.ssafy.io","http://i11b105.p.ssafy.io")
                .allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(),
                        HttpMethod.DELETE.name(), HttpMethod.HEAD.name(), HttpMethod.OPTIONS.name(),
                        HttpMethod.PATCH.name())
                .allowCredentials(true)
                .maxAge(1800); // Pre-flight Caching
    }


    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToSerchConditionConverter());
    }

    private static class StringToSerchConditionConverter implements Converter<String, SearchCondition> {
        @Override
        public SearchCondition convert(String source) {
            return SearchCondition.fromString(source);
        }
    }
}
