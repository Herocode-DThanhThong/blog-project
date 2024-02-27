package com.blogroot.blogroot.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationDTO {
    private Integer page;
    private Integer limit;
    private Long total;
}
