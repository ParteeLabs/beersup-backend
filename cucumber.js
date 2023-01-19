const now = new Date().toISOString().replaceAll(':', '-');
module.exports = {
  release: {
    parallel: 5,
    format: [`html:./release-reports/report_${now}.html`],
    publishQuiet: true,
    tags: 'not (@skip or @wip)',
  },
};
