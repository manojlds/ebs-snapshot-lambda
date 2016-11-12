var region = process.env.AWS_DEFAULT_REGION || "us-east-1";

var getRegion = function () {
  return region;
}

var getRegionObject = function() {
  return { region: region };
}

var getTags = function(tags) {
  return tags.reduce(function(final, current) {
    final[current.Key] = current.Value;
    return final;
  }, {});
}

exports.getRegion = getRegion;
exports.getRegionObject = getRegionObject;
exports.getTags = getTags;
