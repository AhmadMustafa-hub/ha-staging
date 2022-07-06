<?php 
    $company = get_post_meta($id, '_project_company', true);

?>
<div class="col-md-8 col-lg-8 project-cont">
    <div class="card-link archive-view archive-default ">
        <div class="archive-body">
            <h3 class=" project-company"><?= $company; ?></h3>
            <h3 class="  project-name"><?=get_the_title($id); ?></h3>
        </div>
        <div class="row">
            <?php
     $kpi_1 = get_post_meta($id, '_project_kpi_1', true);
     $kpi_1_desc= get_post_meta($id,'_project_kpi_description_1',true);
     $kpi_2 = get_post_meta($id, '_project_kpi_2', true);
     $kpi_2_desc= get_post_meta($id,'_project_kpi_description_2',true);
     $kpi_3 = get_post_meta($id, '_project_kpi_3', true);
     $kpi_3_desc= get_post_meta($id,'_project_kpi_description_3',true);
    if ($kpi_1) {
    echo '<div class="col-md-4 col-lg-4">';
       echo '<h4 class="project-kpi">'.$kpi_1.'</h4>';
       echo '<h5 class="kpi-desc">'.$kpi_1_desc.'</h5>';
       echo '</div>';
       echo '<div class="col-md-4 col-lg-4">';
       echo '<h4 class="project-kpi">'.$kpi_2.'</h4>';
       echo '<h5 class="kpi-desc">'.$kpi_2_desc.'</h5>';
       echo '</div>';
       echo '<div class="col-md-4 col-lg-4">';
       echo '<h4 class="project-kpi">'.$kpi_3.'</h4>';
       echo '<h5 class="kpi-desc">'.$kpi_3_desc.'</h5>';
       echo '</div>';
    }
    // echo "<pre>";
    // print_r($meta);
    
    // _project_kpi_description_1
    ?>
        </div>
    </div>
</div>