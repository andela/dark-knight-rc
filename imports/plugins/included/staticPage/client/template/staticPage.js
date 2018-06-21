/* eslint-disable */
import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { StaticPages } from "/lib/collections";

// Initiate tinymce
Template.staticPage.onRendered(() => {
  /* global tinymce */
  tinymce.init({
    selector: "textarea.pgform",
    height: 400,
    theme: "modern",
      skin_url: "/packages/teamon_tinymce/skins/lightgray", // eslint-disable-line
    plugins: `print preview fullpage searchreplace
          autolink directionality visualblocks visualchars fullscreen
          image link media template codesample table charmap hr pagebreak nonbreaking
          anchor toc insertdatetime advlist lists textcolor
          wordcount imagetools contextmenu colorpicker textpattern`,
    toolbar1: `formatselect | bold italic strikethrough forecolor backcolor | link
        | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat`
  });
});

// Load the static pages details
Template.showStatic.onCreated(function () {
  this.autorun(() => {
    this.subscribe("StaticPages");
  });
});

// get static pages information
Template.showStatic.helpers({
  staticPagesDetails() {
    if (Template.instance().subscriptionsReady()) {
      return StaticPages.find({
        shopId: Reaction.getShopId()
      });
    }
  }
});

// manage static pages
Template.showStatic.events({
  "click .delete-btn": event => {
    event.preventDefault();
    event.stopPropagation();

    // window.console.log("id", $(event.currentTarget).parents("tr").attr("id"));

    Alerts.alert(
      {
        title: "Delete Static Page",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Yes"
      },
      confirmed => {
        if (confirmed) {
          const _id = $(event.currentTarget)
            .parents("tr")
            .attr("id");
          Meteor.call("deleteStaticPage", _id);
        }
        return false;
      }
    );
  },
  "click .edit-btn": event => {
    event.preventDefault();
    event.stopPropagation();

    // get the ID of the row in order to get the static pages details from database
    const _id = $(event.currentTarget)
      .parents("tr")
      .attr("id");

    const staticPageDetails = StaticPages.find({ _id }).fetch();

    // fill the page title field
    $(".createPage")
      .find("#page-title")
      .val(staticPageDetails[0].pageName);

    // Fill page address field
    $(".createPage")
      .find("#page-address")
      .val(staticPageDetails[0].pageAddress);

    // Fill the get_page_to_edit field
    $(".createPage")
      .find(".get_page_to_edit")
      .attr("id", staticPageDetails[0]._id);

    $(".createPage")
      .find(".submit-btn")
      .html(" UPDATE PAGE");


    // Fill the content editor
    tinyMCE.activeEditor.setContent(staticPageDetails[0].pageContent);
    // updates the detail on the form for update
  }
});

Template.showAddStaticPage.events({
  "submit form": event => {
    // console.log("*************");
    event.preventDefault();
    window.console.log(event.target);
    const result = event.target;
    const pageName = result.pageTitle.value;
    const pageAddress = result.pageAddress.value;
    const pageContent = tinyMCE.activeEditor.getContent();
    const userId = Meteor.userId();
    const shopId = Reaction.getShopId();
    const isEnabled =  false;
    let createdAt = new Date();
    const updatedAt =  new Date();
    // window.console.log(pageContent);

    // check mode i.e. editting mode or creating static pages mode
    if ($(".createPage")
      .find(".get_page_to_edit")
      .attr("id") === undefined) {
      Meteor.call("createStaticPage", pageName,
        pageAddress,
        pageContent,
        userId,
        shopId,
        isEnabled,
        createdAt,
        function (err) {
          if (err) {
            // window.console.log(db);
            Alerts.toast(err.message, "Error");
          } else {
            Alerts.toast("Page Successfully Created", "Success");
          }
        });
    } else {
      // get the Id of the page details to update
      const _id = $(".createPage")
        .find(".get_page_to_edit")
        .attr("id");

      // get page detail to update
      const staticPageDetails = StaticPages.find({ _id }).fetch();

      // check if the page details exist
      if (staticPageDetails.length > 0) {
        createdAt = staticPageDetails[0].createdAt;

        // Update the database
        Meteor.call("editStaticPage", _id, pageName,
          pageAddress,
          pageContent,
          userId,
          shopId,
          isEnabled,
          createdAt,
          updatedAt,
          function (err) {
            if (err) {
              // window.console.log(db);
              Alerts.toast(err.message, "Error");
            } else {
              Alerts.toast("Page Successfully Updated", "Success");
            }
          }
        );
      }
    }

    // $('.showAddStaticPage').find('.pageTitle')
    // Reset the field for another operation
    result.pageTitle.value = "";
    result.pageAddress.value = "";
    tinymce.activeEditor.setContent("");
  }


});

