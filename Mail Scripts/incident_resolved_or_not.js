(function runMailScript(current, template, email, email_action, event) {

	//incident
	var inc = '${task_effective_number}';

	//links to trigger email response
	var replyLinkReopen = 'mailto:dev61555@service-now.com?subject=Incident%20Unresolved%20-%20Please%20Reopen:%20'+ inc + '&body=%0D%0A%0D%0A---Please%20type%20reason%20above.%20Do%20not%20edit%20below%20this%20line.---%0D%0A%0D%0A'+email.watermark;

	var replyLinkClose = 'mailto:dev61555@service-now.com?subject=Incident%20Resolution%20Accepted%20-%20Please%20Close:%20'+ inc + '&body=Okay%20to%20Close%20Incident.%0D%0A%0D%0A'+email.watermark;

	//link styling
	var decoration = 'text-decoration: none;';
	var color = 'color: #82C9B8;';
	var fontSize = 'font-size: 16px;';
	var fontFamily = 'font-family: Helvetica, Arial, sans-serif;';
	var display = 'display: inline-block;';
	var padding = 'padding: 1px;';

	//text to advise re-open or close
	template.print('<p><i><font size="3" color="#808080" face="helvetica">');
	template.print(gs.getMessage('Please click a link below to reopen or close:'));
	template.print('</font></i></p>');

	//re-open link
	template.print('<font face="helvetica">');
	template.print('<a href="' + replyLinkReopen + '"');
	template.print('style="' + color + fontSize + fontFamily + display + padding + decoration);
	template.print('">');
	template.print(gs.getMessage('Reopen Incident'));
	template.print('</a>');
	template.print('</font>');

	//formatting
	template.print('<span style="padding-right: 1.5px;"> <font size="3" >');
	template.print(' |');
	template.print('</font></span>');

	//close link
	template.print('<font face="helvetica">');
	template.print('<a href="' + replyLinkClose + '"');
	template.print('style="' + color + fontSize + fontFamily + display + padding + decoration);
	template.print('">');
	template.print(gs.getMessage('Okay to close Incident'));
	template.print('</a>');
	template.print('</font>');
	template.print('<p><font size="3" color="#808080" face="helvetica">');
	template.print('Thank you.');
	template.print('</font></p>');


})(current, template, email, email_action, event);
