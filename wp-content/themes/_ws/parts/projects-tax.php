<?php 
    $services = wp_get_post_terms($id,'service');
    $client = wp_get_post_terms($id,'client');
    $location = wp_get_post_terms($id,'location');
    $reco = wp_get_post_terms($id,'recognition');
    
?>
<div class="services-cont ">
    <div class="">
        <h4 class="tax-title">Client</h4>
        <?php
     foreach($client as $term){
   
        echo '<p class="tax-content">'.$term->name.'</p>';
    }
    ?>
    </div>


    <div class="">
        <h4 class="tax-title">location</h4>
        <?php
     foreach($location as $term){
   
        echo '<p class="tax-content">'.$term->name.'</p>';
    }
    ?>
    </div>
    <div class="">
        <h4 class="tax-title">Services</h4>
        <?php
     foreach($services as $term){
   
        echo '<p class="tax-content">'.$term->name.'</p>';
    }
    ?>
    </div>
    <?php
if($reco){

    echo '<div class="">';
    echo '<h4 class="tax-title">Recognition</h4>';
    foreach($reco as $term){
        echo '<p class="tax-content">'.$term->name.'</p>';
    }
    echo '</div>';
    echo '</div>';
}