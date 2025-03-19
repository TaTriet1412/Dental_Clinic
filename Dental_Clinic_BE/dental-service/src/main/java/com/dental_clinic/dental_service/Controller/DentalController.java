package com.dental_clinic.dental_service.Controller;

import com.dental_clinic.dental_service.DTO.ChangeDentalServiceImageRequest;
import com.dental_clinic.dental_service.DTO.CreateCategoryDTO;
import com.dental_clinic.dental_service.DTO.CreateDentalServiceDTO;
import com.dental_clinic.dental_service.DTO.UpdateDentalServiceDTO;
import com.dental_clinic.dental_service.Entity.Category;
import com.dental_clinic.dental_service.Entity.Dental;
import com.dental_clinic.dental_service.Service.CategoryService;
import com.dental_clinic.dental_service.Service.DentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/dental/service")
public class DentalController {
    @Autowired
    private DentalService dentalService;

    @GetMapping
    public ResponseEntity<List<Dental>> getAllDentalService(){
        List<Dental> dentals = dentalService.getAllDentalServices();
        return new ResponseEntity<>(dentals, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Dental> getDentalById(@PathVariable String id){
        return new ResponseEntity<>(dentalService.getById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Dental> createDentalService(@RequestBody CreateDentalServiceDTO createDentalServiceDTO) {
        return new ResponseEntity<>(dentalService.createDentalService(createDentalServiceDTO),HttpStatus.CREATED);
    }

    @PutMapping(value = "/change-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> changeImg(@ModelAttribute ChangeDentalServiceImageRequest request) {
        dentalService.changeImg(request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("{id}")
    public ResponseEntity<Dental> updateDentalService(@RequestBody UpdateDentalServiceDTO req,
                                                      @PathVariable String id) {
        Dental dental = dentalService.updateDentalService(req,id);
        return new ResponseEntity<>(dental,HttpStatus.OK);
    }
}
