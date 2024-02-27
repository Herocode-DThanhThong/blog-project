package com.blogroot.blogroot.response;

import com.blogroot.blogroot.dtos.PaginationDTO;
import com.blogroot.blogroot.model.RoleManagerRequest;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleManagerRequestListResponse {
    @JsonProperty("data")
    private List<RoleManagerRequest> data;
    @JsonProperty("pagination")
    private PaginationDTO paginationDTO;
}
